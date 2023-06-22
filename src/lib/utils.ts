export const generateMasterKey = async (): Promise<string> => {
	const key = await window.crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 128,
		},
		true,
		["encrypt", "decrypt"]
	)
	const exported = await window.crypto.subtle.exportKey("raw", key)
	const exportedKeyBuffer = new Uint8Array(exported)
	const hexString = Array.prototype.map
		.call(exportedKeyBuffer, (byte) => {
			return ("0" + byte.toString(16)).slice(-2)
		})
		.join("")
	return hexString
}
export const fetcher = async (url: string, token: string) => {
	return await fetch(url, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	}).then((res) => res.json())
}

const hardcodedIV = new Uint8Array([
	0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb,
	0xcc, 0xdd, 0xee, 0xff,
])

export const generateEncryptedPassword = async (
	password: string,
	masterKey: string
): Promise<string> => {
	const encoder = new TextEncoder()
	const keyData = encoder.encode(masterKey)
	const cryptoKey = await window.crypto.subtle.importKey(
		"raw",
		keyData,
		"AES-CBC",
		false,
		["encrypt", "decrypt"]
	)
	const encryptedData = await window.crypto.subtle.encrypt(
		{
			name: "AES-CBC",
			iv: hardcodedIV,
		},
		cryptoKey,
		encoder.encode(password)
	)
	const encryptedMessage = btoa(
		String.fromCharCode.apply(null, [...new Uint8Array(encryptedData)])
	)
	return encryptedMessage
}

export const returnDecryptedPassword = async (
	password: string,
	masterKey: string
): Promise<string> => {
	const encoder = new TextEncoder()
	const keyData = encoder.encode(masterKey)
	const decoder = new TextDecoder()

	const cryptoKey = await window.crypto.subtle.importKey(
		"raw",
		keyData,
		"AES-CBC",
		false,
		["encrypt", "decrypt"]
	)
	const encryptedData = new Uint8Array(
		atob(password)
			.split("")
			.map((char) => char.charCodeAt(0))
	).buffer

	const decryptedData = await window.crypto.subtle.decrypt(
		{
			name: "AES-CBC",
			iv: hardcodedIV,
		},
		cryptoKey,
		encryptedData
	)
	const decrypted = decoder.decode(decryptedData)
	return decrypted
}

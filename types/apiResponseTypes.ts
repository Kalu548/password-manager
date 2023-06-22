export type RegisterLoginResponseType = {
	data: { token: string }
	status: "error" | "success"
	message: string
}

export type UpdateMasterKeyResponseType = {
	status: "error" | "success"
	message: string
	data: {
		key: string
	}
}

export type PasswordDatatype = {
	created_at: string
	id: string
	name: string
	url: string
}

export interface ViewPasswordBaseType extends PasswordDatatype {
	password: string
	username: string
}

export type ViewPasswordResponseType = {
	data: ViewPasswordBaseType
	status: "error" | "success"
	message: string
}

export type AllPasswordsResponseType = {
	data: PasswordDatatype[]
	status: "error" | "success"
	message: string
}

export type DeletePasswordResponseType = {
	data: null
	message: string
	status: "error" | "success"
}

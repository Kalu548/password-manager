import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef } from "react"
import { toast } from "react-toastify"
import { BASE_URL } from "../lib/consts"
import { generateEncryptedPassword } from "../lib/utils"
import { useStore } from "../store"

const CreatePassword = ({
	open,
	setOpen,
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const nameRef = useRef<HTMLInputElement>(null)
	const userNameRef = useRef<HTMLInputElement>(null)
	const websiteRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)

	const { masterKey, token } = useStore()

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		const passData = {
			name: nameRef.current?.value,
			username: userNameRef.current?.value,
			url: websiteRef.current?.value,
			password: passwordRef.current?.value,
		}
		e.preventDefault()
		const id = toast.loading("Encrypting Password ...", {
			draggable: true,
			autoClose: 5000,
		})
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const encryptedPassword = await generateEncryptedPassword(
			passData.password!,
			masterKey!
		).then((enc) => {
			toast.update(id, { render: "Saving Password ..." })
			return enc
		})
		const body = {
			password: encryptedPassword,
			name: passData.name,
			username: passData.username,
			url: passData.url,
		}
		console.log(body)
		const data = await fetch(`${BASE_URL}/password/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		}).then((res) => res.json())
		if (data.status === "success") {
			toast.update(id, {
				render: "Password Saved Successfully",
				type: "success",
				isLoading: false,
				autoClose: 5000,
			})
			setOpen(false)
		} else {
			toast.update(id, {
				render: "Error Saving Password",
				isLoading: false,
				type: "error",
				autoClose: 5000,
			})
		}
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
				</Transition.Child>

				<div className="fixed inset-0 z-10 overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="rounded-lg border bg-primary border-zinc-800 shadow-zinc-800 shadow-sm w-[350px]">
								<div className="flex flex-col space-y-1.5 p-6">
									<Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
										Create Password
									</Dialog.Title>
									<p className="text-sm text-gray-300">
										Create your new secure password in a
										single click.
									</p>
								</div>
								<form action="#" onSubmit={handleFormSubmit}>
									<div className="p-6 pt-0">
										<div className="grid w-full items-center gap-4">
											<div className="flex flex-col space-y-1.5">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Name
												</label>
												<input
													ref={nameRef}
													required
													placeholder="Enter name"
													className="flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm"
												></input>
											</div>
											<div className="flex flex-col space-y-1.5">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Username
												</label>
												<input
													ref={userNameRef}
													required
													placeholder="Enter Username"
													className="flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm"
												></input>
											</div>
											<div className="flex flex-col space-y-1.5">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Website
												</label>
												<input
													ref={websiteRef}
													required
													placeholder="Enter Website url (https://)"
													className="flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm"
												></input>
												<div className="flex flex-col space-y-1.5">
													<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
														Password
													</label>
													<input
														ref={passwordRef}
														required
														placeholder="Enter name"
														className="flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm"
													></input>
												</div>
											</div>
										</div>
									</div>
									<div className="items-center mt-4 p-6 pt-0 flex justify-between">
										<button
											onClick={() => setOpen(false)}
											type="button"
											className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-red-500 text-white hover:bg-red-600 hover:bg-opacity-80 h-8 py-2 px-4"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-green-500 text-white hover:bg-green-600 hover:bg-opacity-90 h-8 py-2 px-4"
										>
											Generate
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default CreatePassword

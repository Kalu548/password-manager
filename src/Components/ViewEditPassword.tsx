import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useRef, useState } from "react"
import { toast } from "react-toastify"
import useSWR from "swr"
import { ViewPasswordResponseType } from "../../types/apiResponseTypes"
import { BASE_URL } from "../lib/consts"
import {
	fetcher,
	generateEncryptedPassword,
	returnDecryptedPassword,
} from "../lib/utils"
import { useStore } from "../store"

const ViewEditPassword = ({
	open,
	setOpen,
	type,
	passId,
}: {
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	type: "View" | "Edit"
	passId: string
}) => {
	const formDisabled = type === "View" ? true : false
	const nameRef = useRef<HTMLInputElement>(null)
	const userNameRef = useRef<HTMLInputElement>(null)
	const websiteRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)
	const { token, masterKey } = useStore()

	const { data } = useSWR<ViewPasswordResponseType>(
		[`${BASE_URL}/password/get/${passId}`, token],
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		([url, token]) => fetcher(url, token as string)
	)
	const [password, setPassword] = useState<string>("")
	returnDecryptedPassword(
		data?.data.password as string,
		masterKey as string
	).then((res) => setPassword(res))

	if (data?.status === "error") {
		toast.error("Some error occured")
		console.log(data.message)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const id = toast.loading("Encrypting Password ...", {
			draggable: true,
			autoClose: 5000,
		})
		const passData = {
			id: passId,
			name: nameRef.current?.value,
			username: userNameRef.current?.value,
			url: websiteRef.current?.value,
			password: passwordRef.current?.value,
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await generateEncryptedPassword(passData.password!, masterKey!).then(
			(enc) => {
				passData.password = enc
				toast.update(id, { render: "Saving Password ..." })
			}
		)
		const data = await fetch(`${BASE_URL}/password/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(passData),
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
										{type === "View" ? "View" : "Edit"}{" "}
										Password
									</Dialog.Title>
									<p className="text-sm text-gray-300">
										{type === "View" ? "View" : "Edit"} Your
										Password
									</p>
								</div>
								<form action="#" onSubmit={handleSubmit}>
									<div className="p-6 pt-0">
										<div className="grid w-full items-center gap-4">
											<div className="flex flex-col space-y-1.5">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Name
												</label>
												<input
													defaultValue={
														data?.data.name
													}
													ref={nameRef}
													required
													disabled={formDisabled}
													placeholder="Enter name"
													className={`flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm ${
														formDisabled
															? "hover:cursor-not-allowed opacity-80"
															: ""
													}`}
												/>
											</div>
											<div className="flex flex-col space-y-1.5">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Username
												</label>
												<input
													defaultValue={
														data?.data.username
													}
													ref={userNameRef}
													required
													disabled={formDisabled}
													placeholder="Enter Username"
													className={`flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm ${
														formDisabled
															? "hover:cursor-not-allowed opacity-80"
															: ""
													}`}
												/>
											</div>
											<div className="flex flex-col space-y-1.5">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Website
												</label>
												<input
													defaultValue={
														data?.data.url
													}
													ref={websiteRef}
													required
													disabled={formDisabled}
													placeholder="Enter Website url (https://)"
													className={`flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm ${
														formDisabled
															? "hover:cursor-not-allowed opacity-80"
															: ""
													}`}
												/>
												<div className="flex flex-col space-y-1.5">
													<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
														Password
													</label>
													<input
														defaultValue={password}
														ref={passwordRef}
														required
														disabled={formDisabled}
														placeholder="Enter name"
														className={`flex outline-none bg-primary border-zinc-800 h-10 w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 px-3 text-sm ${
															formDisabled
																? "hover:cursor-not-allowed opacity-80"
																: ""
														}`}
													></input>
												</div>
											</div>
										</div>
									</div>
									<div className="items-center mt-4 p-6 pt-0 flex justify-between">
										<button
											type="button"
											onClick={() => setOpen(false)}
											className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-red-500 text-white hover:bg-red-600 hover:bg-opacity-80 h-8 py-2 px-4"
										>
											{type === "View"
												? "Close"
												: "Cancel"}
										</button>
										{type === "Edit" && (
											<button
												type="submit"
												className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background bg-green-500 text-white hover:bg-green-600 hover:bg-opacity-90 h-8 py-2 px-4"
											>
												Save
											</button>
										)}
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

export default ViewEditPassword

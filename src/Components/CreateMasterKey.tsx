import { Dialog, Transition } from "@headlessui/react"
import { InfoIcon } from "lucide-react"
import { Fragment, useState } from "react"
import { toast } from "react-toastify"
import { UpdateMasterKeyResponseType } from "../../types/apiResponseTypes"
import { BASE_URL } from "../lib/consts"
import { generateMasterKey } from "../lib/utils"
import { useStore } from "../store"

const CreateMasterKey = ({ openState }: { openState: boolean }) => {
	const [open, setOpen] = useState(openState)
	const [key, setKey] = useState<null | string>(null)
	const { isOnBoarding, addMasterKey, token, setOnboarding } = useStore()
	const handleGenerateButtonClick = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault()
		const genKey = await generateMasterKey()
		setKey(genKey)
	}
	const handleCopyButtonClick = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault()
		const data: UpdateMasterKeyResponseType = await fetch(
			`${BASE_URL}/user/create_master_key`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					master_key: key,
				}),
			}
		).then((res) => res.json())
		if (data.status === "success") {
			addMasterKey(key as string)
			await navigator.clipboard.writeText(key as string)
			toast.success("Master Key Copied!")
			setOnboarding(false)
		} else {
			toast.error(data.message)
		}
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={setOpen}>
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
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							enterTo="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0 sm:scale-100"
							leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						>
							<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-primary text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-lg">
								<div className="bg-primary px-10 pt-10 pb-5">
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-400 bg-opacity-25 sm:mx-0 sm:h-10 sm:w-10">
											<InfoIcon
												className="h-6 w-6 text-green-600"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-xl font-semibold leading-6 text-white"
											>
												Master Key
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-300">
													A master Key needs to be
													generated for your account
													which will be used to
													encrypt and decrypt the
													passwords. The key is not
													stored in the database so it
													cannot be recovered. Please
													kindly save it for future
													use
												</p>
											</div>
											{!key && (
												<button
													type="submit"
													onClick={
														handleGenerateButtonClick
													}
													className="mt-4 flex w-auto px-4 mb-5 text-md justify-center rounded-md bg-green-500 py-1 font-semibold leading-6 text-white shadow-sm hover:bg-green-600 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
												>
													Generate Key
												</button>
											)}
											{key && (
												<div className="p-5 pr-14">
													<div className="relative flex flex-col items-center group">
														<button
															onClick={
																handleCopyButtonClick
															}
															className="italic text-md font-thin text-gray-400 bg-gray-700 bg-opacity-20 rounded-md px-2 py-1 border border-gray-700 hover:scale-105 duration-300 ease-in-out focus:ring-0"
														>
															{key}
														</button>
														<div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
															<span className="relative z-10 p-2 text-xs leading-none rounded-md text-black bg-white whitespace-no-wrap shadow-lg">
																Click to copy it
															</span>
															<div className="w-3 h-3 -mt-2 rotate-45 bg-gray-300"></div>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
									{!isOnBoarding && (
										<div className="sm:flex sm:flex-row-reverse">
											<button
												type="submit"
												onClick={(e) => {
													e.preventDefault()
													setOpen(!open)
													setOnboarding(false)
												}}
												className="mt-4 flex w-auto px-4 text-md justify-center rounded-md bg-red-600 py-1 font-semibold leading-6 text-white shadow-sm hover:bg-red-700 transition-all duration-200"
											>
												Close
											</button>
										</div>
									)}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default CreateMasterKey

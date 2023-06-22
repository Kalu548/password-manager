import { Dialog, Transition } from "@headlessui/react"
import { AlertTriangle } from "lucide-react"
import React, { Fragment, useRef } from "react"
import { toast } from "react-toastify"
import { DeletePasswordResponseType } from "../../types/apiResponseTypes"
import { BASE_URL } from "../lib/consts"
import { useStore } from "../store"

const DeleteConfirmation = ({
	open,
	setOpen,
	passId,
}: {
	passId: string
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const cancelButtonRef = useRef(null)
	const { token } = useStore()
	const handleDelete = async (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault()
		const id = toast.loading("Deleting please wait...", {
			closeButton: true,
			draggable: true,
		})
		const data: DeletePasswordResponseType = await fetch(
			`${BASE_URL}/password/delete/${passId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		).then((res) => res.json())
		if (data.status === "success") {
			toast.update(id, {
				render: "Password deleted successfully",
				type: "success",
				isLoading: false,
				autoClose: 2000,
			})
		} else {
			toast.update(id, {
				render: data.message,
				type: "error",
				isLoading: false,
				autoClose: 2000,
			})
		}
		setOpen(false)
	}
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as="div"
				className="relative z-10"
				initialFocus={cancelButtonRef}
				onClose={setOpen}
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
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
							<Dialog.Panel className="border-zinc-700 border shadow-sm py-3 shadow-zinc-800 relative transform overflow-hidden rounded-lg bg-black text-left transition-all sm:my-8 sm:w-full sm:max-w-lg">
								<div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-600 bg-opacity-25 sm:mx-0 sm:h-10 sm:w-10">
											<AlertTriangle
												className="h-6 w-6 text-red-600"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-base font-semibold leading-6 text-white"
											>
												Delete Password
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Are you sure you want to
													delete this password? It
													cannot be recovered once it
													is deleted.
												</p>
											</div>
										</div>
									</div>
								</div>
								<div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
									<button
										type="button"
										className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
										onClick={handleDelete}
									>
										Delete
									</button>
									<button
										type="button"
										className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
										onClick={() => setOpen(false)}
										ref={cancelButtonRef}
									>
										Cancel
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default DeleteConfirmation

import { Menu, Transition } from "@headlessui/react"
import { ClipboardIcon, Edit, MoreVertical, Trash2Icon } from "lucide-react"
import { Fragment, useState } from "react"
import { PasswordDatatype } from "../../types/apiResponseTypes"
import DeleteConfirmation from "./DeleteConfirmation"
import ViewEditPassword from "./ViewEditPassword"
const PasswordCard = ({ ...props }: PasswordDatatype) => {
	const [deleteButton, setDeleteButton] = useState<boolean>(false)
	const [viewPassword, setViewPassword] = useState<boolean>(false)
	const [editPassword, setEditPassword] = useState<boolean>(false)
	return (
		<div>
			<ViewEditPassword
				passId={props.id}
				open={viewPassword}
				setOpen={setViewPassword}
				type="View"
			/>
			<ViewEditPassword
				passId={props.id}
				open={editPassword}
				setOpen={setEditPassword}
				type="Edit"
			/>
			<div className="border-opacity-100 border-zinc-700 border rounded-xl">
				<div className="p-6 bg-primary rounded-xl border-zinc-700 border-b gap-x-4 flex items-center">
					<img
						src={`https://www.google.com/s2/favicons?domain=${props.url}&sz=256`}
						className="ring-[#111827] ring-opacity-10 object-cover bg-white rounded-lg flex-none w-16 h-16"
					/>
					<h1 className="text-white text-xl font-semibold">
						{props.name}
					</h1>
					<Menu
						as="div"
						className="ml-auto relative inline-block text-left"
					>
						<div>
							<Menu.Button>
								<MoreVertical className="w-4 h-4" />
							</Menu.Button>
						</div>
						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 w-28 origin-top-right divide-y divide-zinc-800 rounded-md bg-black border border-zinc-700 shadow-md shadow-zinc-900">
								<div>
									<button
										onClick={() => setEditPassword(true)}
										className="text-gray-200 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm"
									>
										<Edit className="mr-2 h-4 w-4 text-md" />
										Edit
									</button>
								</div>
								<div>
									<button
										onClick={() => setViewPassword(true)}
										className="text-gray-200 hover:text-white group flex w-full items-center rounded-md px-2 py-2 text-sm"
									>
										<ClipboardIcon className="mr-2 h-4 w-4 text-md" />
										View
									</button>
								</div>
								<div>
									<DeleteConfirmation
										passId={props.id}
										open={deleteButton}
										setOpen={setDeleteButton}
									/>
									<button
										onClick={() => setDeleteButton(true)}
										className="text-gray-200 hover:text-white bg-red-600 group flex w-full items-center rounded-b-md px-2 py-2 text-sm"
									>
										<Trash2Icon className="mr-2 h-4 w-4 text-md" />
										Delete
									</button>
								</div>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
				<div className="leading-6 text-sm py-4 px-6 -m-3">
					<div className="py-3 gap-x-4 flex justify-between">
						<h1 className="text-white">Created At</h1>
						<p>{new Date(props.created_at).toDateString()}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PasswordCard

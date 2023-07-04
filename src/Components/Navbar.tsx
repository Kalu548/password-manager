import { Menu, Transition } from "@headlessui/react"
import { DownloadIcon, LogOutIcon, Plus } from "lucide-react"
import { Fragment, useState } from "react"
import { ExportPasswordResponseType } from "../../types/apiResponseTypes"
import { BASE_URL } from "../lib/consts"
import { useStore } from "../store"
import CreatePassword from "./CreatePassword"
const Navbar = () => {
	const { reset, masterKey, token } = useStore()
	const [createPassword, setCreatePassword] = useState(false)
	const exportPassClick = async () => {
		const data = (await fetch(
			`${BASE_URL}/password/export_all?master_key=${masterKey}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		).then((res) => res.json()) as ExportPasswordResponseType
		if (data.status === "success") {
			window.open(`${BASE_URL}/${data.data!.download_url}`, "_blank")
		} else {
			console.log("Some error occured")
		}
	}
	return (
		<div>
			<nav className="sticky bg-black z-30 top-0 w-full pb-6">
				<div className="flex items-center justify-between my-0 mx-auto w-full">
					<div className="bg-gradient-to-r hover:cursor-pointer from-green-600 via-green-500 to-green-300 w-12 h-12 rounded-full" />
					<div className="flex items-center h-full space-x-5">
						<button
							onClick={() => setCreatePassword(true)}
							className="mt-4 flex w-auto px-4 mb-5 pr-6 text-md justify-center rounded-md bg-green-500 py-2 font-semibold leading-6 text-white shadow-sm hover:bg-green-600 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
						>
							<CreatePassword
								open={createPassword}
								setOpen={setCreatePassword}
							/>
							<Plus className="mr-1" />
							New Password
						</button>
						<Menu
							as="div"
							className="ml-auto relative inline-block text-left"
						>
							<div>
								<Menu.Button>
									<img
										src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
										className="w-11 h-11 bg-white rounded-full"
									/>
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
								<Menu.Items className="absolute right-0 w-40 origin-top-right divide-y divide-zinc-800 rounded-md bg-black border border-zinc-700 shadow-md shadow-zinc-900">
									<button
										onClick={() => reset()}
										className="text-gray-200 text-md hover:text-white group flex w-full items-center rounded-md px-2 py-2"
									>
										<LogOutIcon className="mr-2 h-5 w-5 text-md" />
										Signout
									</button>
									<button
										onClick={() => exportPassClick()}
										className="text-gray-200 text-md hover:text-white group flex w-full items-center rounded-md px-2 py-2"
									>
										<DownloadIcon className="mr-2 h-5 w-5 text-md" />
										Export
									</button>
								</Menu.Items>
							</Transition>
						</Menu>
					</div>
				</div>
			</nav>
		</div>
	)
}

export default Navbar

import { useRef, useState } from "react"
import { toast } from "react-toastify"
import { RegisterLoginResponseType } from "../../types/apiResponseTypes"
import { BASE_URL } from "../lib/consts"
import { useStore } from "../store"

const LoginForm = () => {
	const [formType, setFormType] = useState<"login" | "register">("login")
	const buttonText = formType === "login" ? "Login" : "Register"
	const emailInputElement = useRef<HTMLInputElement>(null)
	const passwordInputElement = useRef<HTMLInputElement>(null)
	const userNameInputElement = useRef<HTMLInputElement>(null)
	const masterKeyInputElement = useRef<HTMLInputElement>(null)
	const { addToken, addMasterKey, setOnboarding } = useStore()

	const handleFormSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault()
		if (formType == "register") {
			const id = toast.loading("Please wait...", {
				closeButton: true,
				draggable: true,
			})
			const data = {
				email: emailInputElement.current?.value,
				password: passwordInputElement.current?.value,
				username: userNameInputElement.current?.value,
			}
			const createResponse: RegisterLoginResponseType = await fetch(
				`${BASE_URL}/user/create`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			).then((res) => res.json())
			if (createResponse.status === "success") {
				toast.update(id, {
					render: createResponse.message,
					type: "success",
					isLoading: false,
					autoClose: 5000,
				})
				addToken(createResponse.data.token)
				setOnboarding(true)
			} else {
				toast.update(id, {
					render: createResponse.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				})
			}
		} else {
			const id = toast.loading("Please wait...", {
				closeButton: true,
				draggable: true,
			})
			const data = {
				email: emailInputElement.current?.value,
				password: passwordInputElement.current?.value,
				master_key: masterKeyInputElement.current?.value,
			}
			const createResponse: RegisterLoginResponseType = await fetch(
				`${BASE_URL}/user/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			).then((res) => res.json())
			if (createResponse.status === "success") {
				toast.update(id, {
					render: createResponse.message,
					type: "success",
					isLoading: false,
					autoClose: 5000,
				})
				addToken(createResponse.data.token)
				addMasterKey(data.master_key as string)
				setOnboarding(false)
			} else {
				toast.update(id, {
					render: createResponse.message,
					type: "error",
					isLoading: false,
					autoClose: 5000,
				})
			}
		}
	}

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
					{buttonText} {formType === "login" ? "in to" : ""} your
					account
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form
					className="space-y-4"
					action="#"
					onSubmit={handleFormSubmit}
				>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium leading-6 text-white"
						>
							Email address
						</label>
						<div className="mt-2">
							<input
								ref={emailInputElement}
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								placeholder="Enter your email"
								className="block bg-primary w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 text-sm sm:leading-6"
							/>
						</div>
					</div>
					{formType === "login" && (
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-white"
							>
								Master Key
							</label>
							<div className="mt-2">
								<input
									ref={masterKeyInputElement}
									id="master_key"
									name="master_key"
									type="password"
									required
									placeholder="Enter your master key"
									className="block bg-primary w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 text-sm sm:leading-6"
								/>
							</div>
						</div>
					)}
					{formType === "register" && (
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-white"
							>
								Username
							</label>
							<div className="mt-2">
								<input
									ref={userNameInputElement}
									id="username"
									name="username"
									type="text"
									required
									placeholder="Enter your username"
									className="block bg-primary w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-zinc-800 text-gray-400 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 text-sm sm:leading-6"
								/>
							</div>
						</div>
					)}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium leading-6 text-white"
						>
							Password
						</label>
						<div className="mt-2">
							<input
								ref={passwordInputElement}
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								placeholder="Enter your password"
								className="block bg-primary w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-zinc-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
						>
							{buttonText}
						</button>
					</div>
				</form>
				{formType === "login" && (
					<p className="mt-10 text-center text-sm text-gray-500">
						Not a member?{" "}
						<button
							onClick={() => setFormType("register")}
							className="font-semibold leading-6 text-green-500 hover:text-green-500"
						>
							Register Now
						</button>
					</p>
				)}
			</div>
		</div>
	)
}

export default LoginForm

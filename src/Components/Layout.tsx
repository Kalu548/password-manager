import { useStore } from "../store"
import CreateMasterKey from "./CreateMasterKey"
import Navbar from "./Navbar"
import PasswordPage from "./PasswordPage"
const Layout = () => {
	const { isOnBoarding } = useStore()
	return (
		<div className="p-5">
			<Navbar />
			<CreateMasterKey openState={isOnBoarding} />
			<h1 className="text-4xl font-bold mb-8">My Passwords</h1>
			<PasswordPage />
		</div>
	)
}

export default Layout

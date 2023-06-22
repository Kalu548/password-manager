import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Layout from "./Components/Layout"
import LoginForm from "./Components/LoginForm"
import { useStore } from "./store"

const App = () => {
	const { token } = useStore()
	return (
		<div>
			<ToastContainer
				position="top-right"
				theme="dark"
				autoClose={3000}
				closeButton
			/>
			{!token ? <LoginForm /> : <Layout />}
		</div>
	)
}

export default App

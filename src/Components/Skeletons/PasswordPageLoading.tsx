import PasswordCardLoading from "./PasswordCardLoading"

const PasswordPageLoading = () => {
	return (
		<div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
			{[...Array(6)].map((_, index) => (
				<PasswordCardLoading key={index} />
			))}
		</div>
	)
}

export default PasswordPageLoading

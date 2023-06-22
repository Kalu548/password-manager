import useSWR from "swr"
import { AllPasswordsResponseType } from "../../types/apiResponseTypes"
import { BASE_URL } from "../lib/consts"
import { fetcher } from "../lib/utils"
import { useStore } from "../store"
import PasswordCard from "./PasswordCard"
import PasswordPageLoading from "./Skeletons/PasswordPageLoading"
const PasswordPage = () => {
	const { token } = useStore()
	const { data, isLoading } = useSWR<AllPasswordsResponseType>(
		[`${BASE_URL}/password/all`, token],
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		([url, token]) => fetcher(url, token as string),
		{ refreshInterval: 1000 }
	)
	return (
		<>
			{isLoading && <PasswordPageLoading />}
			<div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
				{data?.data.map((password, index) => (
					<PasswordCard {...password} key={index} />
				))}
			</div>
		</>
	)
}

export default PasswordPage

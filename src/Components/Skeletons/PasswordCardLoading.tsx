const PasswordCardLoading = () => {
	return (
		<div className="border-opacity-100 border-zinc-700 border rounded-xl overflow-hidden">
			<div className="p-6 bg-primary group border-zinc-700 border-b gap-x-4 flex items-center">
				<div className="ring-[#111827] ring-opacity-10 object-cover animate-pulse bg-zinc-800 rounded-lg flex-none w-16 h-16" />
				<h1 className="bg-zinc-800 h-6 rounded-md w-32 animate-pulse"></h1>
			</div>
			<div className="leading-6 text-sm py-4 px-6 -m-3">
				<div className="py-3 gap-x-4 flex justify-between">
					<h1 className="bg-zinc-800 h-5 rounded-md w-20 animate-pulse"></h1>
					<p className="bg-zinc-800 h-5 rounded-md w-36 animate-pulse"></p>
				</div>
			</div>
		</div>
	)
}

export default PasswordCardLoading

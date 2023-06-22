import { create } from "zustand"
import { persist } from "zustand/middleware"

type State = {
	token: string | null
	masterKey: string | null
	isOnBoarding: boolean
	passId: string | null
	isVisible: boolean
}

type Actions = {
	addToken: (token: string) => void
	addMasterKey: (masterKey: string) => void
	setOnboarding: (isOnBoarding: boolean) => void
	reset: () => void,
	setIsVisible: (isVisible: boolean) => void
	setPassId: (passId: string) => void

}

const InitialState: State = {
	passId: null,
	isVisible: false,
	token: null,
	isOnBoarding: false,
	masterKey: null,
}

export const useStore = create(
	persist<State & Actions>(
		(set) => ({
			...InitialState,
			setIsVisible: (isVisible: boolean) =>
				set((state) => ({ ...state, isVisible })),
			setPassId: (passId: string) =>
				set((state) => ({ ...state, passId })),
			setOnboarding: (isOnBoarding: boolean) =>
				set((state) => ({ ...state, isOnBoarding })),
			addToken: (token: string) => set((state) => ({ ...state, token })),
			addMasterKey: (masterKey: string) =>
				set((state) => ({ ...state, masterKey })),
			reset: () => set(InitialState),
		}),
		{ name: "store" }
	)
)

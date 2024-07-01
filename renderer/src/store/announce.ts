import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface init {
    announce?: string | undefined
    visible?: boolean
}

export const announceInit: init = {

}
export const announceSlice = createSlice({
    name: 'announce',
    initialState: announceInit,
    reducers: {
        announce(state, action: PayloadAction<typeof announceInit.announce | undefined>) {
            state.announce = action.payload;
        },

        setVisible(state, action: PayloadAction<typeof announceInit.visible>) {
            state.visible = action.payload;
        }
    }   
})
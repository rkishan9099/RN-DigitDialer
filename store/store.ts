import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import sip from "@/store/sip";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


export const store = configureStore({
  reducer: {
    sip,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      isSerializable: false,
      serializableCheck: false,
    }),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

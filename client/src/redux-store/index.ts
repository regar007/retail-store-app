import { configureStore, Store } from '@reduxjs/toolkit'
import rootReducer from './root.reducer'
import userReducer from './user.reducer'
// import filtersReducer from '../features/filters/filtersSlice'

export const store: Store = configureStore({
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([]),
  reducer: {
    user: userReducer,
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof rootReducer>

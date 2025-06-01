const initialState = {
  toasts: [], // Lưu danh sách thông báo
};

export default function toastReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.message],
      };
    case "CLEAR_TOASTS":
      return {
        ...state,
        toasts: [],
      };
    default:
      return state;
  }
}
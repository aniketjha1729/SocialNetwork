import axios from "../api/axios";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";
import { setAlert } from "./alert";
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    header: {
      "Content=Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = axios.post("/api/users/register", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert("invalid", "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

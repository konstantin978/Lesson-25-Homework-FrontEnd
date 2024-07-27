'use client'
import { handleLogout, handleValidate } from "../lib/actions";
import { useActionState } from "react";

export default function Page() {

    const [state, handleValidateAction] = useActionState(handleValidate, {message: ''})

    return <div className="p-6">
        <h1 className="is-size-1">Change Login</h1>
        {state.message && <p style={{color: 'red'}}>{state?.message}</p>}
        <form action={handleValidateAction}>
            <input
                type="text"
                className="input is-dark"
                placeholder="Please enter your current login"
                name="currentlogin"
            />
            <input
                type="text"
                className="input is-dark"
                placeholder="Please enter your new login"
                name="newlogin"
            />
            <button className="button is-danger">Change</button>
        </form>
    </div >

};
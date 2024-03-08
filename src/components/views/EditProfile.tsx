import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {Link, useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";

const FormField = (props) => {
    return (
        <div className="profile field">
            <label className="profile label">{props.label}</label>
            <input
                className="profile input"
                placeholder="enter here.."
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const Profile = () => {
    // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const id = localStorage.getItem("id");
    const [user, setUser] = useState<User>(null);
    const [username, setUsername] = useState<string>(null);
    const [birthday, setBirthday] = useState(null);

    const logout = (): void => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const updateUser = async () => {
        const token = localStorage.getItem("token");
        try {
            const requestBody = JSON.stringify({username, birthday, token});
            await api.put("/users/" + id, requestBody);
            navigate(`/profile?id=${id}`);
        } catch (error) {
            alert(`you cannot edit this user: \n${handleError(error)}`)
        }
    }

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://react.dev/reference/react/useEffect
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/users/${id}`);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUser(response.data);
                setUsername(response.data.username);
                setBirthday(response.data.birthday);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log("request to:", response.request.responseURL);
                console.log("status code:", response.status);
                console.log("status text:", response.statusText);
                console.log("requested data:", response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(
                    `Something went wrong while fetching the users: \n${handleError(
                        error
                    )}`
                );
                console.error("Details:", error);
                alert(
                    "Something went wrong while fetching the users! See the console for details."
                );
            }
        }

        fetchData();
    }, []);

    let content = <Spinner />;

    if (user) {
        content = (
            <div>
            <FormField
                label="Username"
                value={username}
                onChange={(un: string) => setUsername(un)}
            />
            <FormField
                label="Birthday"
                value={birthday}
                onChange={(bd: string) => setBirthday(bd)}
            />
            </div>
        );
    }

    return (
        <BaseContainer className="profile container">
            <p className="profile paragraph">
            </p>
            {content}
            <Button
                onClick={() => updateUser()}>
                save
            </Button>
        </BaseContainer>
    );
};

export default Profile;

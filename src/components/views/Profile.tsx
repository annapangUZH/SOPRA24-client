import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import {Link, useNavigate, useParams} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";
import { User } from "types";


const Profile = () => {
    // use react-router-dom's hook to access navigation, more info: https://reactrouter.com/en/main/hooks/use-navigate
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search);
    const id = queryParameters.get("id");
    const [user, setUser] = useState<User>(null);

    const logout = (): void => {
        localStorage.removeItem("token");
        navigate("/login");
    };

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
        <ul>
            <li>username: {user.username}</li>
            <li>onlineStatus: {user.status}</li>
            <li>creationDate: {user.creationDate}</li>
            <li>birthday: -</li>
        </ul>
      );
    }

    return (
        <BaseContainer className="profile container">
            <p className="profile paragraph">
            </p>
            {content}
        </BaseContainer>
    );
};

export default Profile;

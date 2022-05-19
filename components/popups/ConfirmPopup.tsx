import React, { FC, useState, useEffect } from "react";
import PopupWrapper from "./PopupWrapper";
import { usePopup } from "../../context/PopupContext";

interface Props {}

const ConfirmPopup: FC<Props> = ({}) => {
    const { confirmPopup, setConfirmPopup } = usePopup();

    return (
        <PopupWrapper
            isOpen={confirmPopup}
            closePopup={() => setConfirmPopup(false)}
            size={"transferPopup"}
            headerContent={""}
        >
            <p>Confirm</p>{" "}
        </PopupWrapper>
    );
};

export default ConfirmPopup;

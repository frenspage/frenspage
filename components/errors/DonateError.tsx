import React, { FC, useState, useEffect } from "react";

interface Props {
    errorCode: number;
    errorMessage: string | any;
}

const DonateError: FC<Props> = ({ errorCode, errorMessage }) => {
    if (errorCode === 4001)
        return (
            <div
                style={{ textAlign: "center" }}
                className="paddingBottom paddingTop"
            >
                <p className="c--red">Transaction canceled</p>
            </div>
        );
    return (
        <div
            style={{ textAlign: "center" }}
            className="paddingBottom paddingTop"
        >
            <p className="c--red">Error: {errorMessage}</p>
        </div>
    );
};

export default DonateError;

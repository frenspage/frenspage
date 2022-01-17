import React, { FC, useState, useEffect } from "react";

interface Props {}

const LoadingSpinner: FC<Props> = ({}) => {
    return (
        <div className="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
        </div>
    );
};

export default LoadingSpinner;

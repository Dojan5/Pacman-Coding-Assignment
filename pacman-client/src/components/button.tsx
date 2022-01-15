import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export interface IButton {
    children?: JSX.Element | JSX.Element[] | string | string[] 
}

export const Button: React.FC<IButton> = ({children}) => (
    <button className="button">{children}</button>
)

export interface ILinkButton extends IButton {
    to: string
}

export const LinkButton: React.FC<ILinkButton> = ({children, to}) => {
    const navigate = useNavigate();

    const handleClick = () => navigate(to);

    return (
        <button 
            className="button"
            onClick={() => handleClick()}
        >{children}</button>
    )
}
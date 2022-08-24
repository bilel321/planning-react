import React, { useState } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';
import styled, { css } from 'styled-components';

let Wrapper = styled.div`
min-height: 300px;
margin: 0;
padding: 0;
display: flex;
align-items: center;
justify-content: center;
`;

const Loader = (props) => {
    return (
        <Wrapper style={props.style}>
            <ProgressSpinner 
            className="dark:bg-gray-900"
            style={{ width: props.size||'50px', height: props.size||'50px' }} strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s" />
        </Wrapper>
    );
}

export default Loader;
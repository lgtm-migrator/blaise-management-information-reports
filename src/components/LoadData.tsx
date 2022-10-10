import { ONSLoadingPanel, ONSPanel } from "blaise-design-system-react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";

export type DataRenderer<T> = (data: T) => ReactNode

interface LoaderProps<T> {
    dataPromise: Promise<T>;
    errorMessage?: string | ((error: Error) => ReactNode);
    onError?: (error: Error) => void;
    children: DataRenderer<T>;
}

class LoadingState {}

class LoadedState<T> {
    constructor(public readonly data: T) {}
}

class ErroredState {
    constructor(public readonly error: Error) {}
}

type LoadState<T> = LoadingState | LoadedState<T> | ErroredState

export function LoadData<T>({ children, dataPromise, errorMessage, onError }: LoaderProps<T>): ReactElement {
    const [loadState, setLoadState] = useState<LoadState<T>>(new LoadingState());

    async function loadData() {
        setLoadState(new LoadedState(await dataPromise));
    }

    function setErroredState(error: Error): void {
        if (onError) {
            onError(error);
        }
        setLoadState(new ErroredState(error));
    }

    useEffect(() => {
        setLoadState(new LoadingState());

        loadData().catch(setErroredState);
    }, [dataPromise]);

    function getErrorMessage(error: Error): ReactNode {
        if (typeof(errorMessage) === "string") {
            return errorMessage;
        }

        if (errorMessage !== undefined) {
            return errorMessage(error);
        }

        return error.toString();
    }

    function content(): ReactNode {
        if (loadState instanceof LoadedState) {
            return children(loadState.data);
        }

        if (loadState instanceof ErroredState) {
            return (
                <ONSPanel status="error">
                    <p>{ getErrorMessage(loadState.error) }</p>
                </ONSPanel>
            );
        }

        return <ONSLoadingPanel/>;
    }

    return <>{ content() }</>;
}

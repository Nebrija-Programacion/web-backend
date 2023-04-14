import React, { useEffect, useState } from "react"

const Test = () => {
    useEffect(() => {
        const fetchTest = async () => {
            const response = await fetch("http://127.0.0.1:8080/test");
            const json = await response.json();
            setData(json);
        }
        fetchTest();
    }
    , []);

    const [data, setData] = useState<{test: string} | undefined>(undefined);

    return (<>
        {data && data.test}
    </>)
}

export default Test;
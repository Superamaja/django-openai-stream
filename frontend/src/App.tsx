import { useState } from "react";

const App = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Send a request to http://127.0.0.1:8000/chat/ with prompt
        const response = await fetch("http://127.0.0.1:8000/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: input,
            }),
        });

        const reader = response.body?.getReader();
        let result = "";
        let decoder = new TextDecoder();
        if (reader) {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                result += decoder.decode(value);
                setResponse(result);
            }
            console.log("Response fully received");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Prompt"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <input type="submit" value="Submit" />
            </form>
            <p>{response}</p>
        </div>
    );
};

export default App;

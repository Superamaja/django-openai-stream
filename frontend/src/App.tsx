import { useState } from "react";

interface Message {
    role: string;
    content: string;
}

const App = () => {
    const [input, setInput] = useState("");
    // Example messages: [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello"}]
    const [messages, setMessages] = useState<Message[]>([]);
    const [reset, setReset] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let newMessages = [...messages, { role: "user", content: input }];

        setMessages(newMessages);
        setInput("");

        // Send a request to http://127.0.0.1:8000/chat/ with messages in the body
        // Example response: {"messages": [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello"}], "reset": false}
        const response = await fetch("http://127.0.0.1:8000/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: newMessages,
            }),
        });

        const reader = response.body?.getReader();
        let result = "";
        let decoder = new TextDecoder();
        if (reader) {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                result = decoder.decode(value);
                try {
                    const splitResponse = result.split("}{");
                    if (splitResponse.length > 1) {
                        const correctedResponse =
                            "{" + splitResponse[splitResponse.length - 1];
                        console.log(
                            "Stream Combined response:\n" +
                                result +
                                "\n\nCorrected into:\n" +
                                correctedResponse
                        );
                        const parsedResponse = JSON.parse(correctedResponse);
                        setMessages(parsedResponse.messages);
                        setReset(parsedResponse.reset);
                    } else {
                        const parsedResponse = JSON.parse(result);
                        setMessages(parsedResponse.messages);
                        setReset(parsedResponse.reset);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }

    return (
        <div>
            <p>
                {messages.map((item: any) => (
                    <span>
                        {item.role}: {item.content}
                        <br />
                    </span>
                ))}
            </p>
            {!reset && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your prompt..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <input type="submit" value="Send" />
                </form>
            )}
        </div>
    );
};

export default App;

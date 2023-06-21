import { useState } from "react";

interface Message {
    role: string;
    content: string;
}

const App = () => {
    const [input, setInput] = useState("");
    // Example messages: [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello! How"}]
    const [messages, setMessages] = useState<Message[]>([]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let newMessages = [...messages, { role: "user", content: input }];

        setMessages(newMessages);
        setInput("");

        // Send a request to http://127.0.0.1:8000/chat/ with prompt
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
                console.log(result);
                try {
                    setMessages(JSON.parse(result));
                } catch (e) {
                    console.log(e);
                }
            }
            console.log("Response fully received");
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
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your prompt..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <input type="submit" value="Send" />
            </form>
        </div>
    );
};

export default App;

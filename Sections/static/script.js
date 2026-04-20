async function enviarMensaje() {
    const input = document.getElementById("user-input");
    const mensaje = input.value;
    if (!mensaje) return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += "<div><strong>Tú:</strong> " + mensaje + "</div>";

    const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({mensaje})
    });
    const data = await res.json();
    chatBox.innerHTML += "<div><strong>Bot:</strong> " + data.respuesta + "</div>";
    input.value = "";
    console.log("archivo cargado");
	chatBox.scrollTop = chatBox.scrollHeight;
}

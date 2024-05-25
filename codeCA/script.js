function generateCode() {
    const name = document.getElementById('nameInput').value.trim();
    if (name === '') {
        document.getElementById('codeDisplay').innerText = '未填入名称';
        return;
    }
    // 发送名字到服务器并接收随机代号
    fetch('/generateCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('codeDisplay').innerText = `${name}——${data.code}`;
    });
}

function viewCode() {
    // 转入代号查看网站
    window.location.href = 'note.ms/noteCFLASDS';
}

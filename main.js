import fs from "fs/promises"
import PromptSync from "prompt-sync"
import { json } from "stream/consumers"
const prompt = PromptSync()

const caminho = './tarefas.json'

async function lerTarefas() {
    try {
        const dados = await fs.readFile(caminho, "utf-8")
        return JSON.parse(dados)
    } catch (error) {
        console.log(error.message)
        return []
    }
}

async function escreverTarefas(tarefas) {
    await fs.writeFile(caminho,JSON.stringify(tarefas, null, 2), 'utf-8')
    console.log("arquvo atualizado")
}




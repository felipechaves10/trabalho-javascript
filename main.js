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


async function criarTarefas() {
    const titulo = prompt('Digite um titulo: ')   
    const descricao = prompt("Digite uma decricao: ") 
    const tarefas = await lerTarefas()
    const novoId = tarefas.length + 1


    const novaTarefa = {
        id: novoId,
        titulo,
        descricao,
        concluida: false
    }

    tarefas.push(novaTarefa)

    await escreverTarefas(tarefas)
}

async function vizualizarTodasAsTarefas() {
    const tarefas = await lerTarefas()
    console.log(tarefas)
}

async function vizualizarTarefasConcluidas() {
    const tarefas = await lerTarefas()
    const concluidas = tarefas.filter(t => t.concluida === true)
    
    if (concluidas.length > 0) {
        console.log("Tarefas concluidas")
        concluidas.forEach((item, index) => {
            console.log(`${index + 1}. Título: ${item.titulo}, Descrição: ${item.descricao}, Concluída: ${item.concluida}`)
        })
    } else {
        console.log("Tarefas não encontradas")
    }
}
async function tarefasNãoconcluidas() {
    const tarefas = await lerTarefas()
    const tarefasNãoconcluidas = tarefas.filter(t => t.concluida === false)

    if(tarefasNãoconcluidas.length > 0){
        console.log("Tarefas não concluidas")
        tarefasNãoconcluidas.forEach((item, index) => {
            console.log(`${index + 1}. Titulo: ${item.titulo}, Descrição: ${item.descricao}, Concluida:
                ${item.concluida}
                    
            `)
        })
    }
}

  async function concluirTarefa() {
    const tarefas = await lerTarefas()
    if (tarefas.length === 0) {
        console.log("Nenhuma tarefa encontrada.")
        return
    }

    console.log("\n Tarefas disponíveis:")
    tarefas.forEach(t => {
        console.log(`ID: ${t.id} | Título: ${t.titulo} | Concluída: ${t.concluida ? 'Sim' : 'Não'}`)
    })

    const concluirT = +prompt('Digite o ID da tarefa que deseja concluir: ')

    const tarefa = tarefas.find(t => t.id === concluirT)

    if (!tarefa) {
        console.log("Tarefa não encontrada.")
        return
    }

    tarefa.concluida = true
    await escreverTarefas(tarefas)
    console.log(`Tarefa ${tarefa.titulo} foi concluída com sucesso!`)
}

const excluirTarefa = async () => {
    const tarefas =  await lerTarefas()

    if (tarefas.length === 0) {
        console.log('Nenhuma tarefa encontrada!')
    }

    console.log("Tarefas disponíveis:")
    tarefas.forEach((tarefa, index) => {
        console.log(`${index + 1}. Título: ${tarefa.titulo}, Descrição: ${tarefa.descricao}`)
    })

    const escolhaExcluir = +prompt('Digite o ID da tarefa que você deseja excluir: ')
    const index = tarefas.findIndex(t => t.id === escolhaExcluir)
    
// 0 -1 é Quando ele não encotra o item dentro do array
    if (index === -1) {
        console.log('Tarefa não encontrada.')
        return


    }

    // para observarmos a tarefa excluida
    const tarefaRemovida = tarefas.splice(index, 1)[0]
    await escreverTarefas(tarefas)
    console.log(`Tarefa foi excluída com sucesso!`)
        // "${tarefaRemovida.titulo}"
}
async function menu() {
    let opcao = ''

    do {
        console.log('\n=== MENU ===')
        console.log('1 - Criar uma nova tarefa')
        console.log('2 - Vizualizar todas as tarefas')
        console.log('3 - Visualizar apenas tarefas concluídas')
        console.log('4 - Visualizar apenas tarefas não concluídas')
        console.log('5 - Concluir uma tarefa')
        console.log('6 - Excluir uma tarefa')
        console.log('7 - Sair')

        opcao = prompt('Escolha a sua opção: ')

        switch (opcao) {
            case '1':
                await criarTarefas()
                break;
            case '2':
                await vizualizarTodasAsTarefas()    
                break
            case '3':
                await vizualizarTarefasConcluidas()
                break
            case '4':
                await tarefasNãoconcluidas()
                break
            case '5':
                await concluirTarefa()
                break
            case '6':
                await excluirTarefa()    
            case '7':
                console.log('Saindo...')
                break                
            default:
                console.log('Opção invalida. Tente novamnete!')
        }
    } while (opcao !== '7')
}

await menu()

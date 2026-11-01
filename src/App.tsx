import { useState, type FormEvent } from 'react'

interface TaskProps {
  content: string,
  level: number,
  date: Date
}

export default function App(){

  const [content, setContent] = useState('')
  const [level, setLevel] = useState('')
  const [task, setTask] = useState<TaskProps>()

  const data: Date = new Date();

  const diaSemana: string = data.toLocaleDateString("pt-BR", {
    weekday: "long",
  });

  const dataCompleta: string = data.toLocaleDateString('pt-BR')

  function addTask(e: FormEvent<HTMLFormElement>){
    e.preventDefault();

    if(content !== '' && level !== ''){
      alert()
      return
    }
  }

  return (
    <div className="bg-(--background) w-full h-screen">

      <header>
        <div>
          <h1>{diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}</h1>
          <p>{dataCompleta}</p>
        </div>
        <span>tarefas concluidas</span>
      </header>

      <main>
        <form onSubmit={addTask}>

          <label>Digite a tarefa</label>
          <input 
            type='text'
            value={content}
            onChange={ e => setContent(e.target.value)}
          />

          <label>Prioridade</label>
          <select
            value={level}
            onChange={ e => setLevel(e.target.value)}
          >
            <option value="1">Nível 1</option>
            <option value="2">Nível 2</option>
            <option value="3">Nível 3</option>
          </select>

          
          <button
            type='submit'
          >
            Adicionar
          </button>
        </form>
      </main>

    </div>
  )
}
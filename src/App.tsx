import { useState, type FormEvent } from 'react'
import { Toaster, toast } from 'sonner'

interface TaskProps {
  content: string,
  level: number,
  date: string
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

  function addTask(e: FormEvent){
    e.preventDefault();

    if(content.length === 0 && level.length === 0){
      toast.error('Preencha o formulario para adicionar')
      return;
    }

    setTask({
      content: content,
      level: Number(level),
      date: dataCompleta
    })

    setContent('')
    setLevel('')
  }

  console.log(task)

  return (
    <div className="bg-(--base) w-full h-screen flex flex-col items-center justify-center">

      <Toaster
        position="top-right"
        duration={3000}
        closeButton
      />

      <header className='flex items-center justify-between w-3/4 gap-2 bg-(--backgroud) rounded-md mb-3 pt-3 pb-3 shadow-md'>
        <div className='flex flex-col border-r-2 border-r-(--borda) w-1/2 pl-3 gap-1'>

          <h1 className='text-5xl font-bold text-(--destaque)'>
            {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}
          </h1>

          <p className='font-semibold text-(--texto-primo) text-xl'>{dataCompleta}</p>

        </div>

        <div className='flex flex-col gap-0.5'>
          <h2 className='text-(--texto-primo) font-semibold text-2xl mr-4'>Você tem</h2>

          <span className='text-(--destaque) font-semibold text-xl mr-4'>{setTask.length} tarefas</span>
        </div>
      </header>

      <main className='w-3/4 bg-(--backgroud) rounded-md h-2/4 flex p-3 shadow-md'>
        <section className='w-1/2 border-r-2 border-r-(--borda) pr-3'>
 
          <form
            onSubmit={addTask}
            className="flex flex-col gap-3 bg-(--card) rounded-md p-6 w-full h-full"
          >
            <div className="flex flex-col mb-2">
              <h2 className="text-2xl font-bold text-(--destaque)">
                Nova tarefa
              </h2>
              <p className="text-sm text-(--texto-segundo)">
                Adicione uma tarefa à sua lista.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-(--texto-primo)">
                Descrição da tarefa
              </label>

              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-(--backgroud) border border-(--borda) rounded-md px-3 py-2 text-sm text-(--texto-primo) transition-all placeholder:text-(--texto-segundo)"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-(--texto-primo)">
                Nível de prioridade
              </label>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-(--backgroud) border border-(--borda) rounded-md px-3 py-2 text-sm text-(--texto-primo) transition-all placeholder:text-(--texto-segundo)"
              >
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-(--destaque) text-white font-semibold rounded-md py-3 mt-2 transition-all hover:bg-(--hover) active:scale-[0.98] cursor-pointer"
            >
              Adicionar tarefa
            </button>
          </form>

        </section>



      </main>

    </div>
  )
}
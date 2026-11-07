
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  type FormEvent
} from 'react'

import { Toaster, toast } from 'sonner'

interface TaskProps {
  id: string
  content: string
  level: number
  date: string
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [content, setContent] = useState('')
  const [level, setLevel] = useState('1')
  const [task, setTask] = useState<TaskProps[]>([])
  const [edit, setEdit] = useState({
    enabled: false,
    tarefa: ''
  })

  const data = new Date()

  const diaSemana = data.toLocaleDateString('pt-BR', {
    weekday: 'long'
  })

  const dataCompleta = data.toLocaleDateString('pt-BR')

  const addTask = useCallback((e: FormEvent<HTMLFormElement>) => {
  e.preventDefault()

  if (!content.trim()) {
    toast.error('Digite uma descrição para a tarefa!')
    return
  }

  if (edit.enabled) {
    saveTask()
  } else {
    const novaTarefa: TaskProps = {
      id: crypto.randomUUID(),
      content: content.trim(),
      level: Number(level),
      date: dataCompleta
    }

    setTask((tarefas) => [...tarefas, novaTarefa])

    toast.success('Tarefa adicionada!')
  }

  setContent('')
  setLevel('1')
  setEdit({ enabled: false, tarefa: '' })

  inputRef.current?.focus()

}, [content, level, dataCompleta, edit])

  const nTasks = useMemo(() => {
    return task.length
  }, [task])

  function deleteTask(id: string){
    setTask((tarefas) =>
      tarefas.filter((tarefa) => tarefa.id !== id)
    )

    toast.success('Tarefa excluída!')
  }

  function modificar(tarefa: TaskProps) {

    setContent(tarefa.content)
    setLevel(String(tarefa.level))

    setEdit({
      enabled: true,
      tarefa: tarefa.id
    })

    inputRef.current?.focus()

    toast.info('Editando tarefa.')
  }

  function saveTask() {
  setTask((tarefas) =>
    tarefas.map((tarefa) =>
      tarefa.id === edit.tarefa
        ? {
            ...tarefa,
            content: content.trim(),
            level: Number(level)
          }
        : tarefa
    )
  )

  toast.success('Tarefa atualizada!')
}

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

          <p className='font-semibold text-(--texto-primo) text-xl'>
            {dataCompleta}
          </p>

        </div>

        <div className='flex flex-col gap-0.5'>

          <h2 className='text-(--texto-primo) font-semibold text-2xl mr-4'>
            Você tem
          </h2>

          <span className='text-(--destaque) font-semibold text-xl mr-4'>
            {nTasks} tarefas
          </span>

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
                {edit.enabled ? 'Editar tarefa' : 'Nova tarefa'}
              </h2>

            </div>

            <div className="flex flex-col gap-1">

              <label
                htmlFor="content"
                className="text-sm font-semibold text-(--texto-primo)"
              >
                Descrição da tarefa
              </label>

              <input
                id="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={inputRef}
                className="w-full bg-(--backgroud) border border-(--borda) rounded-md px-3 py-2 text-sm text-(--texto-primo) transition-all placeholder:text-(--texto-segundo)"
              />

            </div>

            <div className="flex flex-col gap-1">

              <label
                htmlFor="level"
                className="text-sm font-semibold text-(--texto-primo)"
              >
                Nível de prioridade
              </label>

              <select
                id="level"
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
              {edit.enabled ? 'Alterar tarefa' : 'Adicionar tarefa'}
            </button>

            {edit.enabled && (
              <button
                type='button'
                onClick={ () => {
                  setEdit({ enabled: false, tarefa: '' })
                  setContent('')
                  setLevel('1')
                  inputRef.current?.focus()
                }}
                className="text-sm text-(--texto-segundo) cursor-pointer hover:text-(--destaque) transition-colors"
              >
                Cancelar Alteração
              </button>
            )}
          </form>

        </section>

        <section className="flex-1 min-w-0 pl-3 flex flex-col gap-3 overflow-y-auto">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-(--destaque)">
              Minhas tarefas
            </h2>

          </div>


          {task.length === 0 ? (

            <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">

              <span className="text-(--texto-primo) font-semibold">
                Nenhuma tarefa por aqui.
              </span>

            </div>

          ) : (

            task.map((tarefa) => (

              <div
                key={tarefa.id}
                className="flex items-center justify-between gap-3 bg-(--card) rounded-sm p-3"
              >

                <div className="flex flex-col gap-1 min-w-0">

                  <span className="font-semibold text-(--texto-primo)">
                    {tarefa.content}
                  </span>

                  <span className="text-xs text-(--texto-segundo)">
                    {tarefa.date}
                  </span>

                  <div className="text-xs font-semibold text-(--destaque)">
                    Prioridade: {
                      tarefa.level === 1
                        ? <span className="text-xs font-semibold text-(--destaque)">Baixo</span>
                        : tarefa.level === 2
                          ? <span className="text-xs font-semibold text-amber-400">Medio</span>
                          : <span className="text-xs font-semibold text-red-700">Alto</span>
                    }
                  </div>

                </div>


                <div className="flex items-center gap-2 shrink-0">

                  <button
                    type="button"
                    onClick={() => modificar(tarefa)}
                    className="text-(--destaque) font-semibold text-sm cursor-pointer"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => {deleteTask(tarefa.id)}}
                    className="text-red-700 font-semibold text-sm cursor-pointer"
                  >
                    Excluir
                  </button>

                </div>

              </div>

            ))

          )}

        </section>

      </main>

    </div>
  )
}

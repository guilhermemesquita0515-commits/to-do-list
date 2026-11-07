
import {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
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
  const [carregado, setCarregado] = useState(false)
  const [edit, setEdit] = useState({
    enabled: false,
    tarefa: ''
  })

  useEffect(() => {
    const tarefaSalva = localStorage.getItem('@tarefas')

    if (tarefaSalva) {
      setTask(JSON.parse(tarefaSalva))
    }

    setCarregado(true)
  }, [])

  useEffect(() => {
    if (carregado) {
      localStorage.setItem('@tarefas', JSON.stringify(task))
    }
  }, [task, carregado])

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

  const nTasks = useMemo(() => task.length, [task])

  function deleteTask(id: string) {
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
    <div className="
      bg-(--base)
      w-full min-h-screen
      flex flex-col items-center
      px-3 py-5
      sm:px-6 sm:py-8
    ">

      <Toaster
        position="top-right"
        duration={3000}
        closeButton
      />

      {/* HEADER */}

      <header className="
        flex flex-col sm:flex-row
        items-start sm:items-center
        justify-between
        w-full max-w-6xl
        gap-4
        bg-(--backgroud)
        rounded-md mb-3
        p-4 sm:p-5
        shadow-md
      ">

        <div className="
          flex flex-col
          border-b-2 sm:border-b-0
          sm:border-r-2
          border-(--borda)
          w-full sm:w-1/2
          pb-3 sm:pb-0
          sm:pr-3
          gap-1
        ">

          <h1 className="
            text-3xl sm:text-4xl lg:text-5xl
            font-bold
            text-(--destaque)
          ">
            {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}
          </h1>

          <p className="
            font-semibold
            text-(--texto-primo)
            text-base sm:text-xl
          ">
            {dataCompleta}
          </p>

        </div>

        <div className="flex flex-col gap-0.5">

          <h2 className="
            text-(--texto-primo)
            font-semibold
            text-xl sm:text-2xl
          ">
            Você tem
          </h2>

          <span className="
            text-(--destaque)
            font-semibold
            text-lg sm:text-xl
          ">
            {nTasks} tarefas
          </span>

        </div>

      </header>

      {/* CONTEÚDO PRINCIPAL */}

      <main className="
        w-full max-w-6xl
        bg-(--backgroud)
        rounded-md
        flex flex-col md:flex-row
        p-3 sm:p-4
        gap-4
        shadow-md
      ">

        {/* FORMULÁRIO */}

        <section className="
          w-full md:w-1/2
          md:border-r-2
          border-(--borda)
          md:pr-4
          pb-4 md:pb-0
        ">

          <form
            onSubmit={addTask}
            className="
              flex flex-col gap-3
              bg-(--card)
              rounded-md
              p-4 sm:p-6
              w-full h-full
            "
          >

            <div className="flex flex-col mb-2">

              <h2 className="
                text-xl sm:text-2xl
                font-bold
                text-(--destaque)
              ">
                {edit.enabled ? 'Editar tarefa' : 'Nova tarefa'}
              </h2>

            </div>

            <div className="flex flex-col gap-1">

              <label
                htmlFor="content"
                className="
                  text-sm font-semibold
                  text-(--texto-primo)
                "
              >
                Descrição da tarefa
              </label>

              <input
                id="content"
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                ref={inputRef}
                placeholder="Digite sua tarefa..."
                className="
                  w-full min-w-0
                  bg-(--backgroud)
                  border border-(--borda)
                  rounded-md
                  px-3 py-2
                  text-sm text-(--texto-primo)
                  transition-all
                  placeholder:text-(--texto-segundo)
                  focus:outline-none
                  focus:border-(--destaque)
                "
              />

            </div>

            <div className="flex flex-col gap-1">

              <label
                htmlFor="level"
                className="
                  text-sm font-semibold
                  text-(--texto-primo)
                "
              >
                Nível de prioridade
              </label>

              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="
                  w-full
                  bg-(--backgroud)
                  border border-(--borda)
                  rounded-md
                  px-3 py-2
                  text-sm text-(--texto-primo)
                  transition-all
                  focus:outline-none
                  focus:border-(--destaque)
                "
              >
                <option value="1">Nível 1</option>
                <option value="2">Nível 2</option>
                <option value="3">Nível 3</option>
              </select>

            </div>

            <button
              type="submit"
              className="
                w-full
                bg-(--destaque)
                text-white font-semibold
                rounded-md py-3 mt-2
                transition-all
                hover:bg-(--hover)
                active:scale-[0.98]
                cursor-pointer
              "
            >
              {edit.enabled ? 'Alterar tarefa' : 'Adicionar tarefa'}
            </button>

            {edit.enabled && (
              <button
                type="button"
                onClick={() => {
                  setEdit({ enabled: false, tarefa: '' })
                  setContent('')
                  setLevel('1')
                  inputRef.current?.focus()
                }}
                className="
                  text-sm
                  text-(--texto-segundo)
                  cursor-pointer
                  hover:text-(--destaque)
                  transition-colors
                "
              >
                Cancelar alteração
              </button>
            )}

          </form>

        </section>

        {/* LISTA DE TAREFAS */}

        <section className="
          flex-1 min-w-0
          md:pl-1
          flex flex-col gap-3
          min-h-60
          md:max-h-150
          overflow-y-auto
        ">

          <div className="flex items-center justify-between">

            <h2 className="
              text-xl sm:text-2xl
              font-bold
              text-(--destaque)
            ">
              Minhas tarefas
            </h2>

          </div>

          {task.length === 0 ? (

            <div className="
              flex flex-col
              items-center justify-center
              flex-1 text-center gap-2
            ">

              <span className="
                text-(--texto-primo)
                font-semibold
              ">
                Nenhuma tarefa por aqui.
              </span>

            </div>

          ) : (

            task.map((tarefa) => (

              <div
                key={tarefa.id}
                className="
                  flex flex-col sm:flex-row
                  sm:items-center
                  justify-between
                  gap-3
                  bg-(--card)
                  rounded-sm
                  p-3 w-full
                "
              >

                <div className="
                  flex flex-col
                  gap-1 min-w-0
                ">

                  <span className="
                    font-semibold
                    text-(--texto-primo)
                  ">
                    {tarefa.content}
                  </span>

                  <span className="
                    text-xs
                    text-(--texto-segundo)
                  ">
                    {tarefa.date}
                  </span>

                  <div className="
                    text-xs
                    font-semibold
                    text-(--destaque)
                  ">
                    Prioridade: {
                      tarefa.level === 1
                        ? <span className="text-(--destaque)">Baixo</span>
                        : tarefa.level === 2
                          ? <span className="text-amber-400">Médio</span>
                          : <span className="text-red-700">Alto</span>
                    }
                  </div>

                </div>

                <div className="
                  flex items-center
                  gap-3 shrink-0
                  self-end sm:self-auto
                ">

                  <button
                    type="button"
                    onClick={() => modificar(tarefa)}
                    className="
                      text-(--destaque)
                      font-semibold text-sm
                      cursor-pointer
                      hover:opacity-70
                      transition-opacity
                    "
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTask(tarefa.id)}
                    className="
                      text-red-700
                      font-semibold text-sm
                      cursor-pointer
                      hover:opacity-70
                      transition-opacity
                    "
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

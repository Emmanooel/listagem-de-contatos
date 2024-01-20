import { FormEvent, useEffect, useState } from 'react'
import style from '../styles/Home.module.scss'

import {database, ref, remove, push, onValue, update, child } from '@/services/firebase'

type contato ={
  chave: string,
  nome: string,
  email: string,
  telefone: string,
  observacoes: string
}

export default function Home() {

  const [nome, setNome] = useState('')
  const [email, setemail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [contatos, setContatos] = useState<contato[]>()

  const [search, setSearch] = useState<contato[]>()
  const [searching, setSearching] = useState(false)

  const [key, setKey] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const databaseContatosRef = ref(database, 'contatos')
    onValue(databaseContatosRef, resultQuery => {
      const result = Object.entries<contato>(resultQuery.val() ?? {}).map(([chave, valor]) => {
        return {
          'chave': chave,
          'nome': valor.nome,
          'email': valor.email,
          'telefone': valor.telefone,
          'observacoes': valor.observacoes
        }
      })

      setContatos(result)
    })
  }, [])

  function saveInDatabase(event: FormEvent){
    event.preventDefault()
   
    const dados = {
      nome,
      email,
      telefone,
      observacoes
    }

    const databaseRef = ref(database, 'contatos')

    push(databaseRef, dados)

    setNome('')
    setemail('')
    setTelefone('')
    setObservacoes('')
  }

  function deleteInDatabase(referencia: string){
    remove(ref(database, `contatos/${referencia}`))
  }

  function searchContatos(event: FormEvent){
    const palavra = event.target.value
    console.log(palavra)
    if(palavra.length > 0){
      setSearching(true)
      const dados = new Array
      contatos?.map(contato => {
        const rule = new RegExp(event.target.value, "gi")
        if(rule.test(contato.nome)){
          dados.push(contato)
        }
        
        setSearch(dados)
      })
    }
   
  }

  function editContatos(contato: contato){
    setUpdating(true)
    setKey(contato.chave)
    setNome(contato.nome)
    setemail(contato.email)
    setTelefone(contato.telefone)
    setObservacoes(contato.observacoes)
  }

  function updateContatos(){
    const databaseRef = ref(database, 'contatos/')

    const dados = {
      'nome': nome,
      'email': email,
      'telefone': telefone,
      'observacoes': observacoes
    }

    update(child(databaseRef, key), dados)

    setNome('')
    setemail('')
    setTelefone('')
    setObservacoes('')
    setUpdating(false)
  }

  return (
    <>
    <main className={style.container}>
      <form >
        <input type="text" placeholder="nome" value={nome} onChange={event => setNome(event.target.value)}></input>
        <input type="email" placeholder="email" value={email} onChange={event => setemail(event.target.value)}></input>
        <input type="tel" placeholder="telefone" value={telefone} onChange={event => setTelefone(event.target.value)}></input>
        <textarea placeholder="observações" value={observacoes} onChange={event => setObservacoes(event.target.value)}></textarea>
        {updating ? 
          <button type="button" onClick={updateContatos} >atualizar</button> :
          <button type="button" onClick={saveInDatabase} >Salvar</button>
        }
      </form>
      <div className={style.cards}>
        <input type="text" placeholder="Buscar" onChange={searchContatos}></input>
        {searching ? 
          search?.map(contato => {
            return(
            <div key={contato.chave} className={style.cardContato}>
            <div className={style.cardOptions}>
              <p className={style.cardName}>{contato.nome}</p>
              <div>
                <a onClick={() => editContatos(contato)}>Editar</a>
                <a onClick={() => deleteInDatabase(contato.chave)}>Excluir</a>
              </div>
            </div>
            <div className={style.cardInfos}>
              <p className={style.cardEmail}>{contato.email}</p>
              <p className={style.cardTelefone}>{contato.telefone}</p>
              <p className={style.cardObservacoes}>{contato.observacoes}</p>
            </div>
          </div>)}) :
          contatos?.map(contato => {
            return(
            <div key={contato.chave} className={style.cardContato}>
            <div className={style.cardOptions}>
              <p className={style.cardName}>{contato.nome}</p>
              <div>
                <a onClick={() => editContatos(contato)}>Editar</a>
                <a onClick={() => deleteInDatabase(contato.chave)}>Excluir</a>
              </div>
            </div>
            <div className={style.cardInfos}>
              <p className={style.cardEmail}>{contato.email}</p>
              <p className={style.cardTelefone}>{contato.telefone}</p>
              <p className={style.cardObservacoes}>{contato.observacoes}</p>
            </div>
          </div>)})

        } 
      </div>
    </main>
    </>
  )
}


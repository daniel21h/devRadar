import React, { useEffect, useState } from 'react';
import api from './services/api'

import './global.css'
import './App.css'
import './Sidebar.css'
import './Main.css'

import DevItem from './components/DevItem'
import DevForm from './components/DevForm'

/*************************************************************************************** */
//Tudo nele e todo o React é baseado nos três conceitos abaixo, que o defini por completo.
//Paradigma de programação imperativa

//Componente: Bloco isolado de HTML, CSS e JS, o qual não intefere no restante da aplicação.
//Propriedade/atributo: Informações que um componente PAI passa para o componente FILHO.
//Estado: Informações mantidas pelo componente (Lembrar: imutabilidade(melhora performance))

//ps.:As funções em React são criadas dentro do componente
//ps.:Desestruturação: const [] >>> É pegar um objeto/vetor e dividi-lo em variáveis.

//Componente App(ps.: componentes sempre começam com letra maiúscula, tendo sempre apenas 
//um comp...por arquivo, por regra do React)
/*************************************************************************************** */

function App() {
const [devs, setDevs] = useState([])

  //Buscando Devs na API
  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs')

      setDevs(response.data)
    }

    loadDevs()
  }, [])

  //Função de clique no submit do form
  async function handleAddDev (data) {

    //Fazendo chamada API Rest com backend
    const response = await api.post('/devs', data)

    //Adicionando o Dev automaticamente pela web sem subscrever devs já existentes
    setDevs([...devs, response.data])
  }

  return (
      <div id="app">
        <aside>
          <strong>Cadastrar</strong>
          <DevForm onSubmit={handleAddDev} />
        </aside>
        <main>
          <ul>
            {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
            ))}
          </ul>
        </main>
      </div>
    );
}

export default App;

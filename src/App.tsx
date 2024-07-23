
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import './reset.css'
function App() {

  const [selectedItems , setSelectedItems] = useState<{id : number | string , label : string}[]>([])

  const [options , setOptions] = useState<{id : number | string , label : string}[]>([])
  
  const [ input , setInput ] = useState('')

  const [ search , setSearch ] = useState<{id : number | string , label : string}[]>([])

  const [showDropDown , setShowDropDown] = useState(false)

  const [loading , setLoading ] = useState(false)

  useEffect( () => {
    setLoading(true)
    fetch('https://669ec84e9a1bda36800791a5.mockapi.io/api/skills')
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setOptions(data)
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
    }) 
  } , [])

  const selectHandler = (e : MouseEvent ) => {
    e.preventDefault()
    
    const id = e.currentTarget?.id
    const option = options.find(item => item.id === id)

    if( option !== undefined){
      if(! selectedItems.includes(option)){
        setSelectedItems(prevState => {
          return [
            ...prevState ,
            option
          ]
        })
      }
    }
  }

  const removeHandler = (e : MouseEvent ) => {
    e.preventDefault()
    
    const id = e.currentTarget?.id
    const selectedItem = selectedItems.find(item => item.id === id)

    if(selectedItem !== undefined){
      if(selectedItems.includes(selectedItem)){
        // selectedItems.filter(item => item !== selectedItem)
        setSelectedItems(prevState => {
          return [
            ...prevState.filter(item => item !== selectedItem)
          ]
        })
      }
    }
  }

  const resetHandler = (e : MouseEvent ) => {
    e.preventDefault()
    setSelectedItems(prevState => {
      return []
    })
  }

  const searchHandler = (e : ChangeEvent<HTMLInputElement>) => {
    
    e.preventDefault()
    const value = e.target?.value
    setInput(value)

    const findedOptions = options.filter((item) => {
      
      let regex = new RegExp(value , 'i' )

      const matched = item.label.match(regex)
      
      if(matched !== null) {
        return true
      }
      
      return false

    })

    setSearch(findedOptions)

  }  

  const dropDownHandler = (e : MouseEvent) => {
    e.preventDefault()
    const dropdownMenu = document.getElementById('dropdown-menu')
    dropdownMenu?.classList.toggle('hidden')
    setShowDropDown(!showDropDown)
  }


  return (
    <div className="App">
      <main className="background">
        <div className="multi-select" >
          {
            selectedItems.length === 0 ?
            <div className={`box multi-select__unselected-section` } id='input'>    
              { 
                showDropDown ?
                <div className="input-search">
                  <input type="text" name="search" onChange={searchHandler} id="search" value={input} placeholder='Search and Select upto 5' />
                </div>
                :
                <span className="label" >Add upto 5 skills</span>
              }
              {
                loading ? 
                <div className='spin' >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div> 
                :
                <button className='btn'  onClick={dropDownHandler} >
                  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"  className="size-6 icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              }
            </div>
            :
            <div className='box multi-select__selected-section' >

              <div className='selected-boxes' >
                {
                  selectedItems.map((item , index) => 
                  <div key={item.id} className="selected-box" >
                    <span>{item.label}</span>

                    <button id={`${item.id}`} onClick={removeHandler} className="btn icon remove-item" >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>            
                    </button>
                  </div>)
                }

                <div className="input-search">
                  <input type="text" name="search" className='' onChange={searchHandler} id="search" value={input} placeholder='search items here...' />
                </div>

              </div>

              <div className='reset-section' >
                <button onClick={resetHandler} className='btn reset-button' >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>

            </div>
          }

          <div  id="dropdown-menu" className={`box multi-select__list-options ${!showDropDown && 'hidden' } `}>
            <ul id="list" className="list">
              {
                search.length === 0 ?
                options.map((option , index) => <li  key={option.id} id={`${option.id}`} onClick={selectHandler}  className={`list__item ${selectedItems.includes(option) && 'selected'}`}>{option.label}</li>)
                :
                search.map((item , index) => <li  key={item.id} id={`${item.id}`} onClick={selectHandler}  className={`list__item ${selectedItems.includes(item) && 'selected'}`} >{item.label}</li>)
              }
            </ul>
          </div>  
        </div>
      </main>
    </div>
  );
}

export default App;

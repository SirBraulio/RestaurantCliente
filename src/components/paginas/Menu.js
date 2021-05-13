import React,{ useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase'

import Platillo from '../ui/Platillo';
const Menu = () => {
    
    const { firebase } = useContext(FirebaseContext);
    //defininimos el state para el platillo
    const [ platillos, guardarPlatillos ] = useState([]);
    //consultamos la bsd al cargar
    useEffect(()=>{
        const obtenerPlatillos=  () =>{
            firebase.db.collection('productos').onSnapshot(handleSnapshot);

        }
        obtenerPlatillos();
    }, []);

    // Snapshot nos permite utilizar la bsd en tiempo real de firestore con snapshot tiempo real con .get obtenemos una consulta
    function handleSnapshot(snapshot){
        const platillos = snapshot.docs.map(doc =>{
            return{
                id: doc.id,
                ...doc.data()
            }
        });
        //almacenamos datos en el state
        guardarPlatillos(platillos)
    }
    return ( 
        <>
            <h1 className= "text-3xl font-ligth mb-4"> Menu  </h1>
            <Link to="/nuevo-platillo" className="bg-blue-800 hover:bg-blue-700, inline-block mb-5 p-2 text-white uppercase font-bold">
                Agregar Platillo
            </Link>
            {platillos.map( platillo =>(
                <Platillo
                    key={platillo.id}
                    platillo={platillo}
                />
            ) )}
        </>
     );
}
 
export default Menu;
import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {FirebaseContext} from '../../firebase';
import { useNavigate } from 'react-router-dom'
import FileUploader from 'react-firebase-file-uploader';
const NuevoPlatillo = () => {

    //state para las imagenes
    const [subiendo, guardarSubiendo] = useState(false);
    const[progreso, guardarProgreso ] = useState(0);
    const [urlimagen, guardarUrlimagen ] = useState('');
    //Context con las operacion de firebase
    const { firebase } = useContext(FirebaseContext);
    //console.log(firebase);

    //Hook para redireccionar
    const navigate = useNavigate();

    //calidacion y leer los datos del formulario
    const formik = useFormik({
        initialValues:{
            nombre:'',
            precio:'',
            categoria:'',
            imagen:'',
            descripcion: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                            .min(3,'Los platillos deben tener como minimo 3 caracteres')
                            .required('El Nombre del platillo es obligatorio'),
            precio: Yup.number()
                            .min(1,'debes agregar un numero')
                            .required('El precio del platillo es obligatorio'),
            categoria: Yup.string()
                            .required('La categoria es obligatoria'),
            descripcion: Yup.string()
                            .min(10,'Intente agregar una descripcion mas extensa')
                            .required('La descripcion es obligatoria'),
        }),
        onSubmit: platillo =>{
            //console.log(datos);
            try {
                platillo.existencia = true;
                platillo.imagen = urlimagen;
                firebase.db.collection('productos').add(platillo)

                //Redireccionamos
                navigate('/menu');
            } catch (error) {
                console.log(error)
            }
        }
    });

    /* Todo sobre las imagenes*/
    const handleUploadStart= () =>{
        guardarProgreso(0);
        guardarSubiendo(true);
    }
    const handleUploadError= (error) =>{
        guardarSubiendo(false);
        console.log(error);
    }
    const handleUploadSuccess = async nombre =>{
        guardarProgreso(100);
        guardarSubiendo(false);

        //almacenar url de destino
        const url = await firebase
                    .storage
                    .ref("productos")
                    .child(nombre)
                    .getDownloadURL();
        console.log(url);
        guardarUrlimagen(url);
    }
    const handleProgress = (progreso) =>{
        guardarProgreso(progreso);
        console.log(progreso);
    }
    return ( 
        
        <>
            <h1 className= "text-3xl font-ligth mb-4"> Nuevo Platillo  </h1>

            <div className=" flex justify-center mt-10">
                <div className="w-full max-w-3xl ">
                    <form
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className= "block text-gray-700 text.sm font-bold mb-2" htmlFor="nombre">Nombre platillo</label>
                            <input
                                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre Platillo"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {//----------------------------error-----------------------------------
                        formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role= "alert">
                                <p className="font-bold">Hubo un error: </p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className= "block text-gray-700 text.sm font-bold mb-2" htmlFor="precio">Precio platillo</label>
                            <input
                                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="$800"
                                min="0"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {//----------------------------error-----------------------------------
                        formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role= "alert">
                                <p className="font-bold">Hubo un error: </p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}
                        
                        <div className="mb-4">
                            <label className= "block text-gray-700 text.sm font-bold mb-2" htmlFor="categoria">Categoria</label>
                            <select 
                                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="categoria"
                                name= "categoria"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                >
                                    <option value="">-- Seleccione</option>
                                    <option value="desayuno">Desayuno</option>
                                    <option value="comida">Comida</option>
                                    <option value="cena">Cena</option>
                                    <option value="bebida">Bebida</option>
                                    <option value="postre">Postre</option>
                                    <option value="ensaladas">Ensaladas</option>
                            </select>
                        </div>
                        
                        {//----------------------------error-----------------------------------
                        formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role= "alert">
                                <p className="font-bold">Hubo un error: </p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className= "block text-gray-700 text.sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                            <FileUploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={ handleUploadStart }
                                onUploadError={ handleUploadError }
                                onUploadSuccess = { handleUploadSuccess }
                                onProgress={ handleProgress }
                            />
                        </div>

                        { subiendo && (
                            <div  className="h-6 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-6 flex items-center" style={{ width: `${progreso}%`}}>
                                    {progreso}%
                                </div>
                            </div>
                        )}
                        {urlimagen &&(
                            <p className="bg-green-500 text-white  text-center my-5 h-6">
                                La imagen se subío con exito.
                            </p>
                        ) }
                        <div className="mb-4">
                            <label className= "block text-gray-700 text.sm font-bold mb-2" htmlFor="descripcion">Descripcion</label>
                            <textarea
                                className="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="descripcion"
                                placeholder="Descripcion del Platillo"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                            </textarea>
                        </div>
                        {//----------------------------error-----------------------------------
                        formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role= "alert">
                                <p className="font-bold">Hubo un error: </p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}
                        <input
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            value="Agregar Platillo"
                        />
                    </form>
                </div>
            </div>
        </>
     );
}
 
export default NuevoPlatillo;
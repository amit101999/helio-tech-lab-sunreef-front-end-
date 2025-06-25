const submitForm = (e ,form)=>{
     e.preventDefault()
      console.log(form)
    // Handle form submission here
    console.log('Form submitted:', form)
    // fetch(import.meta.env.VITE_BURL, { body: JSON.stringify(formData) , method: 'POST'} )
    const res = axios.post(import.meta.env.VITE_BURL , form , {
      headers : {
        'Content-Type': 'multipart/form-data'
      }
    })
    if(res.status === 200){
      toast.success("Ticket created successfully!")
    }
}

export default submitForm
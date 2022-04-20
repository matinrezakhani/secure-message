import {toast} from 'react-toastify'

const lang = localStorage.getItem('language')
export function HandleErrors(err) {
	try {
		if (err.response) {
			if (err.response.data.message && !err.response.data.success) {
				toast.error(err.response.data.message)
			} else {
				throw err;
			}
		} else if(err.message == "Canceled by user") {
			toast.error("درخواست توسط کاربر لغو شد")
		}else{
			throw err;
		}
	} catch (error) {
		toast.error("خطایی پیش آمده، لطفا دوباره تلاش کنید.");
	}
}

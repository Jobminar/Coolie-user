import React from 'react'
import './user-profile.css'
import { useNavigate } from 'react-router-dom'
import saveaddresses from  '../../assets/images/save-address.svg'
import myrewards from  '../../assets/images/my-rewards.svg'
import coupons from  '../../assets/images/coupons.svg'
import mybookings from  '../../assets/images/my-bookings.svg'
import invite from  '../../assets/images/invite-a-frnd.svg'
import wallet from  '../../assets/images/wallet.svg'
import aboutcoolie from  '../../assets/images/about.svg'
import help from  '../../assets/images/help.svg'
import rightarrow from '../../assets/images/right-arrow.svg'


const Userprofile = () => {
  const navigate = useNavigate()
  return (
     <>
            <div className='user-p-main-page'>
                <div className='user-p-pst'>
                          <div className='u-p-sublink'>
                            <img src={saveaddresses} alt='savedaddresses'/>
                            <p>Saved Addresses</p>
                            <img src={rightarrow} alt='rightarrow' className='rightarrow'  onClick={()=>{navigate('/addresses')}}/>
                          </div>
                          <div className='u-p-sublink'>
                          <img src={myrewards} alt='savedaddresses'/>
                          <p>My Rewards</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow'/>
                          </div>
                          <div className='u-p-sublink'>
                          <img src={coupons} alt='savedaddresses'/>
                          <p>Coupons</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow'/>
                          </div>
                          <div className='u-p-sublink' onClick={()=>navigate('/bookings')}>
                          <img src={mybookings} alt='savedaddresses'/>
                          <p>My Bookings</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow'/>
                          </div>
                          <div className='u-p-sublink'>
                          <img src={invite} alt='savedaddresses'/>
                          <p>Invite a friend</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow'/>
                          </div>
                          <div className='u-p-sublink'>
                          <img src={wallet} alt='savedaddresses'/>
                          <p>wallet</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow'/>
                          </div>
                          <div className='u-p-sublink'>
                          <img src={aboutcoolie} alt='savedaddresses'/>
                          <p>About Coope No-1</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow' onClick={()=>{navigate('/aboutus')}}/>
                          </div>
                          <div className='u-p-sublink'>
                          <img src={help} alt='savedaddresses'/>
                          <p>Help</p>
                          <img src={rightarrow} alt='rightarrow' className='rightarrow'/>
                          </div>
                </div>
            </div>
     </>
  )
}

export default Userprofile
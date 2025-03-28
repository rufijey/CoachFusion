import * as React from 'react';
import cl from './Main.module.css'
import { Button } from '@mui/material';
import { FaArrowRight } from "react-icons/fa";


const Main: React.FC  = () => {

    return (
      <div className={cl.container}>
          <div>
              <div className={cl.coach__fusion}>CoachFusion</div>
              <div>The best way to find any coach you need</div>
          </div>
          <Button variant="contained" type="submit" sx={{ mb: 20 }}>
              <span className={cl.search}>Search for coach</span> <FaArrowRight />
          </Button>
      </div>
    );
};

export default Main;
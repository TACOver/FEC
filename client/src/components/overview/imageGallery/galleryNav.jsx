//React dependencies
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Material-UI dependencies
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

//Component/Redux dependencies
import { increment, decrement, setStep, setCurrentPhoto, setStylePhotos } from './imageGallerySlice.js';

const theme = createMuiTheme({
  overrides: {
    MuiStepContent: {
      root: {
        borderLeft: 'none',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 0,
        marginBottom: 5,
        marginLeft: 0
      }
    },
    MuiStepper: {
      root: {
        padding: 8
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: 'transparent'
      }
    }
  }
});

const GalleryNav = (props) => {
  const dispatch = useDispatch();
  const currentStyle = useSelector((state) => state.overview.currentStyle);
  const activeStep = useSelector((state) => state.gallery.currentStep);
  const visibleSteps = useSelector((state) => state.gallery.visibleSteps);

  useEffect(() => {
    if (currentStyle.photos[0] && currentStyle.photos[activeStep].url) {
      dispatch(setCurrentPhoto(currentStyle.photos[activeStep]));
      dispatch(setStylePhotos(currentStyle.photos));
    }
  }, [currentStyle]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: 'auto', maxHeight: 700 }}>

        <div>
          <IconButton
            disabled={activeStep === 0}
            onClick={() => dispatch(decrement())}
          >
            <ArrowUpwardIcon/>
          </IconButton>
        </div>

        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          style={{ height: "auto", maxHeight: 650 }}
          connector={<></>}
        >
          {currentStyle.photos.map((photo, index) => {
            var url;
            if (photo && photo.thumbnail_url) {
              url = photo.thumbnail_url;
            } else {
              url = "https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=675&q=80";
            }
            return (
              <Step
                key={index}
                expanded={true}
                style={visibleSteps.indexOf(index) === -1 ? { display: "none" } : {}}
              >
                <StepContent
                  onClick={() => dispatch(setStep(index))}>
                  <img src={url}
                    style={activeStep === index ?
                      { filter: "drop-shadow(8px 8px 10px gray)", objectFit: "cover", height: 75, width: 75 } :
                      { objectFit: "cover", height: 75, width: 75 }}
                  />
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        <IconButton
          disabled={activeStep === currentStyle.photos.length - 1}
          onClick={() => dispatch(increment())}
        >
          <ArrowDownwardIcon/>
        </IconButton>
      </div>
    </ThemeProvider>
  );
};

export default GalleryNav;
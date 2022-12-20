import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';

import './App.css';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// import Grid from '@mui/material/Grid';
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import path from 'path';
import selectAJSON from '../../assets/selectAJSON.png';

// const { ipcRenderer } = window.require('electron');

// class SelectFileButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: 'Select file...',
//     };
//   }

//   render() {
//     const { value } = this.state;
//     const filePath = 'app://' + value;

//     // .replace(/\\/g, '/')

//     return (
//       <div>
//         <Button
//           onClick={async () => {
//             const response = await window.electron.ipcRenderer.getResponse();
//             alert(response);
//             this.setState({ value: response });
//           }}
//         >
//           {/* {value} */}
//           Select file...
//         </Button>
//         <div>
//           <img alt="icon" width="200" src={filePath} />
//         </div>
//       </div>
//     );
//   }
// }

// class SelectFileButtonBasic extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: 'Select file...',
//     };
//   }

//   render() {
//     const { value } = this.state;

//     return (
//       <button
//         onClick={async () => {
//           const response = await window.electron.ipcRenderer.getResponse();
//           alert(response);
//           this.setState({ value: response });
//         }}
//       >
//         {value}
//       </button>
//     );
//   }
// }

function ButtonUnoriented(props) {
  const { onClick } = props;
  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Unoriented
    </Button>
  );
  // onClick={async () => {
  //   const response = await window.electron.ipcRenderer.getResponse();
  //   alert(response);
  //   this.setState({ value: response });
  // }}
  // >Unoriented<Button />;
}

function ButtonOriented(props) {
  const { onClick } = props;
  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Oriented
    </Button>
  );
}

function ButtonUndefined(props) {
  const { onClick } = props;

  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Undefined
    </Button>
  );
}

function ButtonSelectFile(props) {
  const { onClick } = props;

  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Select sample JSON...
    </Button>
  );
}

function ButtonSave(props) {
  const { onClick } = props;

  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Save Annotations
    </Button>
  );
}

function ButtonPrevious(props) {
  const { onClick } = props;

  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Previous Sample
    </Button>
  );
}

function ButtonNext(props) {
  const { onClick } = props;

  return (
    <Button variant="contained" onClick={onClick} fullWidth>
      Next Sample
    </Button>
  );
}

function ImageCentriole(props) {
  const { value } = props;
  const filePath = `app://${value}`;
  return <img width="400" alt="No JSON Loaded!" src={filePath} />;
}

// const getAssetsPath = async () => {
//   const assetsPath = await window.electron.ipcRenderer.getAssetsPath();
//   return assetsPath;
// }

const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  // color: theme.palette.text.secondary,
}));

class CentrilyzeGUI extends React.Component {
  constructor(props) {
    super(props);

    // const assetsPath = getAssetsPath();
    // console.log(assetsPath);

    console.log('Getting GUI going');
    this.state = {
      value: null,
      // value: selectAJSON,
    };

    window.addEventListener(
      'keyup',
      async (event) => {
        if (event.key === 'ArrowLeft') {
          const imagePath =
            await window.electron.ipcRenderer.selectUnoriented();
          this.setState({ value: imagePath });
        }
        if (event.key === 'ArrowDown') {
          const imagePath = await window.electron.ipcRenderer.selectUndefined();
          this.setState({ value: imagePath });
        }
        if (event.key === 'ArrowRight') {
          const imagePath = await window.electron.ipcRenderer.selectOriented();
          this.setState({ value: imagePath });
        }
        // alert(response);
      },
      true
    );
  }

  async componentDidMount() {
    const { value } = this.state;
    console.log(value);
    if (value === null) {
      const assetsPath = await window.electron.ipcRenderer.getAssetsPath();
      this.setState({ value: assetsPath });
    }
  }

  render() {
    const { value } = this.state;

    return (
      <div>
        <Grid2 container spacing={2}>
          <Grid2 xs={8}>
            <Item>
              <ButtonSelectFile
                onClick={async () => {
                  const imagePath =
                    await window.electron.ipcRenderer.selectFolder();
                  this.setState({ value: imagePath });

                  // alert(response);
                }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={4}>
            <Item>
              <ButtonSave
                onClick={async () => {
                  await window.electron.ipcRenderer.selectSave();
                  // alert(response);
                }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={12}>
            <Item>
              <ImageCentriole
                value={value}
                //   onLoad={async () => {
                //     const imagePath = window.electron.ipcRenderer.getAssetsPath();
                //     this.setState({ value: imagePath });
                // }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={4}>
            <Item>
              <ButtonUnoriented
                onClick={async () => {
                  const imagePath =
                    await window.electron.ipcRenderer.selectUnoriented();
                  this.setState({ value: imagePath });
                }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={4}>
            <Item>
              <ButtonUndefined
                onClick={async () => {
                  const imagePath =
                    await window.electron.ipcRenderer.selectUndefined();
                  this.setState({ value: imagePath });

                  // alert(response);
                }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={4}>
            <Item>
              <ButtonOriented
                onClick={async () => {
                  const imagePath =
                    await window.electron.ipcRenderer.selectOriented();
                  this.setState({ value: imagePath });
                  // alert(response);
                }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={6}>
            <Item>
              <ButtonPrevious
                onClick={async () => {
                  const imagePath =
                    await window.electron.ipcRenderer.selectPrevious();
                  this.setState({ value: imagePath });
                }}
              />
            </Item>
          </Grid2>
          <Grid2 xs={6}>
            <Item>
              <ButtonNext
                onClick={async () => {
                  const imagePath =
                    await window.electron.ipcRenderer.selectNext();
                  this.setState({ value: imagePath });
                }}
              />
            </Item>
          </Grid2>
        </Grid2>
      </div>
    );
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CentrilyzeGUI />} />
      </Routes>
    </Router>
  );
}

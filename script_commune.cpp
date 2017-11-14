#include <iostream>
#include <string>
#include <fstream>
#include <array>
#include <vector>
#include <cmath>

using namespace std;

char nums[10] = {'0','1','2','3','4','5','6','7','8','9'};
bool isFloat(char c){
    for(int i=0; i<10; ++i){
        if(nums[i]==c || c=='.' || c=='-'){
            return true;
        }
    }
    return false;
}

int main(int argc, char* argv[])
{
    string file_path = argv[1];
    string file2_path = argv[2];
    ifstream fichier(file_path.c_str(), ios::in);  // on ouvre en lecture
    std::vector<std::array<string,4> > donnees;

    // RECUP DES COMMUNES DANS DONNEES
    if(fichier)
    {
        string contenu;
        bool inData = false;
        int nObj = 0;

        string nom, code, longitude, latitude;

        //On rempli les donnes des communes
        while(getline(fichier, contenu)){
            //On psse le début jusqu'a data
            if(!inData && contenu.find("\"data\"") != string::npos){
                inData = true;
            }else if (!inData){
                continue;
            }
            //Si on est dans data
            if(inData){
                bool isAttr = false;
                // NOM COMMUNE
                if(contenu.find("\"COMMUNE_LIBELLE\"") != string::npos){
                    isAttr = false;
                    for(int c=0;c<contenu.length();c++){
                        if(contenu[c]==':'){isAttr=true;continue;}else if(!isAttr){continue;}
                        if(contenu[c]!= ' ' && contenu[c]!= '"' && contenu[c]!= '\n' && contenu[c]!= ',' && contenu[c]!= ' '){
                            nom += contenu[c];
                        }
                    }
                }
                // CODE INSEE
                if(contenu.find("\"COMMUNE_CODE_INSEE\"") != string::npos){
                    isAttr = false;
                    for(int c=0;c<contenu.length();c++){
                        if(contenu[c]==':'){isAttr=true;continue;}else if(!isAttr){continue;}
                        if(isFloat(contenu[c])){
                            code += contenu[c];
                        }
                    }
                }
                // LONGITUDE
                if(contenu.find("\"LONGITUDE\"") != string::npos){
                    isAttr = false;
                    for(int c=0;c<contenu.length();c++){
                        if(contenu[c]==':'){isAttr=true;continue;}else if(!isAttr){continue;}
                        if(isFloat(contenu[c])){
                            longitude += contenu[c];
                        }
                    }
                }
                // LONGITUDE
                if(contenu.find("\"LATITUDE\"") != string::npos){
                    isAttr = false;
                    for(int c=0;c<contenu.length();c++){
                        if(contenu[c]==':'){isAttr=true;continue;}else if(!isAttr){continue;}
                        if(isFloat(contenu[c])){
                            latitude += contenu[c];
                        }
                    }
                }
                if(contenu.find("}") != string::npos){
                    donnees.push_back({nom,code,longitude,latitude});
                    nom = code = longitude = latitude = "";
                }
            }
        }
    }
    else
        cerr << "Impossible d'ouvrir le fichier !" << endl;
    fichier.close();

    ifstream fichierL(file2_path.c_str(), ios::in);  // on ouvre en lecture
    if(fichierL)  // si l'ouverture a fonctionné
    {
        string contenu = "";
        bool hasPos = false;
        bool isAttr = false;
        string longitude ="";
        string latitude="";
        std::ofstream os("final.json");// Creation du fichier en écriture

        //On rempli les donnes des communes
        while(getline(fichierL, contenu)){
            // LONGITUDE
            if(contenu.find("\"LONGITUDE\"") != string::npos){
                hasPos = true;
                isAttr = false;
                for(int c=0;c<contenu.length();c++){
                    if(contenu[c]==':'){isAttr=true;continue;}else if(!isAttr){continue;}
                    if(isFloat(contenu[c])){
                        longitude += contenu[c];
                    }
                }
            }
            // LATITUDE
            if(contenu.find("\"LATITUDE\"") != string::npos){
                hasPos = true;
                isAttr = false;
                for(int c=0;c<contenu.length();c++){
                    if(contenu[c]==':'){isAttr=true;continue;}else if(!isAttr){continue;}
                    if(isFloat(contenu[c])){
                        latitude += contenu[c];
                    }
                }
            }

            if(contenu.find("}") != string::npos && hasPos){
                float minDist = 1000.0;
                int minI = 0;
                for(int i=0; i<donnees.size();++i){
                    float longiC = strtof((donnees[i][2]).c_str(),0);
                    float latiC = strtof((donnees[i][3]).c_str(),0);
                    float longi = strtof(longitude.c_str(),0);
                    float lati = strtof(latitude.c_str(),0);
                    float dist = sqrt((longiC-longi)*(longiC-longi) + (latiC-lati)*(latiC-lati));

                    if(dist < minDist){
                        minDist = dist;
                        minI = i;
                    }
                }
                cout << "Nearest of (" << longitude << "," << latitude << ") is " << donnees[minI][0] << endl;
                string toPut = "\t,\"COMMUNE_REF\" : \""+donnees[minI][0]+"\"\n  },\n";

                // On ecrit
                if (!os) { cout<<"Error writing to ..."<<endl; } else {
                    os << toPut;
                }

                longitude = "";
                latitude = "";
                hasPos = false;
            }else{// Sinon on recopie la ligne lue
                if (!os) { cout<<"Error writing to ..."<<endl; } else {
                    os << contenu << endl;
                }
            }
        }
        fichierL.close();
        os.close();
    }
    else
        cerr << "Impossible d'ouvrir le fichier !" << endl;
    return 0;
}

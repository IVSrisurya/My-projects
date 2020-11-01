#include<stdio.h>
//simple interest

int main(){
    float p;
    printf("enter the principal amount\n");
    scanf("%f",&p);
    float t;
    printf("enter your time\n");
    scanf("%f",&t);
    float r;
    printf("enter your change in interest\n");
    scanf("%f",&r);
    float amount = (p*t*r)/100;
    printf("your totla amount is %f",amount);
    return 0;	
}
# FoodDel Desktop App

FoodDelDesktop은 음식 배달앱을 위한 데스크탑 애플리케이션입니다.  
Electron과 React를 기반으로 제작되었으며, Firebase와의 연동, 영수증 출력 등 다양한 기능을 제공합니다.

[데모 보기](https://food-desktop.web.app)

## 목차

- [소개](#소개)
- [기능](#기능)
- [기술 스택](#기술-스택)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [프로젝트 구조](#프로젝트-구조)
- [빌드 및 배포](#빌드-및-배포)
- [기여 방법](#기여-방법)
- [라이선스](#라이선스)
- [문의](#문의)

## 소개

FoodDelDesktop은 음식 배달 서비스를 위한 데스크탑 앱입니다.  
Electron을 통해 크로스 플랫폼 데스크탑 환경에서 실행되며, React와 Firebase를 활용하여 실시간 주문 관리 및 사용자 인터페이스를 제공합니다.

## 기능

- **데스크탑 애플리케이션**: Electron 기반의 데스크탑 환경 제공
- **실시간 주문 관리**: React와 Firebase를 통한 주문 및 메뉴 정보 제공
- **크로스 플랫폼 배포**: Windows (NSIS), macOS (DMG), Linux (AppImage) 지원

## 기술 스택

- **Electron**: 데스크탑 앱 개발 프레임워크
- **React**: 사용자 인터페이스 구성 (react-scripts 활용)
- **Firebase**: 백엔드 서비스 연동
- **electron-builder**: 앱 패키징 및 배포 도구

## 설치 및 실행 방법

### 1. 레포지토리 클론

```bash
git clone https://github.com/aidenjangkkj/del-electron-app.git
cd del-electron-app
